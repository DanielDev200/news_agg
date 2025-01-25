import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Drawer, Tabs, Tab} from '@mui/material';
import LoadingSpinner from './LoadingSpinner';
import ArticleList from './ArticleList';
import WelcomeMessage from './WelcomeMessage';
import WelcomeMessageAuthed from './WelcomeMessageAuthed';
import { useAppContext } from '../context/AppContext';
import { recordUserArticleClick, fetchSwappedArticle, fetchUserArticlesByDate } from '../api/api';
import PopupDialog from './PopupDialog';
import IFrame from './IFrame';

// get caught up, not sucked in

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

export function ExploreSection({ articles, setArticles, articleFetchMade }) {
  const { user, isAuthenticated, authAttempted, userLocation, sources, getUserLocation } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', message: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [articleUrl, setArticleUrl] = useState('');
  const [articleOpensInIframe, setOpensInIframe] = useState(false);
  const [servedContentMessageShown, setServedContentMessageShown] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [clickedArticleId, setClickedArticleId] = useState(null);
  const [timerStartingTime, setTimerStartingTime] = useState(null);
  const [clickedArticleIds, setClickedArticleIds] = useState([]);
  const [persistedClickedArticles, setPersistedClickedArticles] = useState({articles:[]});
  const [tabValue, setTabValue] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    if (isAuthenticated && userLocation) {
      setLoading(articleFetchMade === false);
    } else {
      setLoading(false);
    }
  }, [articleFetchMade, isAuthenticated, userLocation]);

  useEffect(() => {
    const fetchArticles = async () => {
      const formattedDate = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
      if (user && user.id) {
        const fetchedPersistedClickedArticles = await fetchUserArticlesByDate(user.id, formattedDate);
        setPersistedClickedArticles(fetchedPersistedClickedArticles);
        setTimeout(() => {
          setProgressWidth(fetchedPersistedClickedArticles.articles.length === 0  ? 11 : (fetchedPersistedClickedArticles.articles.length / 6)*100);
        }, 500)
      } else {
        setProgressWidth(11);
      }
      
    };
  
    fetchArticles();

    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleArticleClick = async (article) => {
    let canLoadInIframe = true;
    setClickedArticleId(article.id);

    sources.forEach((source) => {
      if (article.url.includes(source.source) && source.loads_in_iframe === 0) {
        canLoadInIframe = false;
      }
    });

    setTimerStartingTime(Date.now());
    setOpensInIframe(canLoadInIframe);
    setArticleUrl(article.url);
    setDrawerOpen(true);

    if (isAuthenticated && user) {
      await recordUserArticleClick(user.id, article.id);
      setClickedArticleIds([...clickedArticleIds, article.id]);
      const formattedDate = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const fetchedPersistedClickedArticles = await fetchUserArticlesByDate(user.id, formattedDate);
      setPersistedClickedArticles(fetchedPersistedClickedArticles);
    }
  };

  const handleNotRegistered = () => {
    setPopupContent({
      title: 'Registration Required',
      message: 'You need to register or log in to swap articles.',
    });
    setPopupOpen(true);
    return;
  };

  const handleSetSwappedArticle = (newArticle, index) => {
    setArticles((prevArticles) => {
      const updatedArticles = [...prevArticles];
      updatedArticles[index] = newArticle;
      return updatedArticles;
    });
  };

  const handleArticleMessage = (message) => {
    setPopupContent({
      title: 'No More Articles',
      message,
    });
    setPopupOpen(true);
  };

  const handleArticleError = (fetchError) => {
    console.error('Error fetching unserved article:', fetchError);
    setPopupContent({
      title: 'Error',
      message: 'An error occurred while fetching a new article. Please refresh the page and try again.',
    });
    setPopupOpen(true);

    return;
  };

  const handleArticleSwap = async (index) => {
    if (!isAuthenticated) {
      handleNotRegistered();
      return;
    }

    const { city, state } = userLocation.city && userLocation.state ? userLocation: await getUserLocation(user.id);

    try {
      const {
        article: newArticle,
        articleMessage,
        message,
        messageType,
        error: fetchError,
      } = await fetchSwappedArticle(
        city,
        state,
        user.id,
        articles[index].category,
        articles[index].id
      );

      if (fetchError) {
        handleArticleError(fetchError);
        return;
      }

      if (articleMessage && !servedContentMessageShown && messageType === 'servedContentShown') {
        handleArticleMessage(message);
        setServedContentMessageShown(true);
      }

      if (newArticle) {
        handleSetSwappedArticle(newArticle, index);
      } else {
        console.warn("Unexpected response: No error, no new article, and no 'articleMessage' flag.");
      }
    } catch (error) {
      handleArticleError(error);
    }
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const renderContent = () => {
    if (!authAttempted) {
      return null;
    }

    if (!isAuthenticated && !articleFetchMade) {
      return <WelcomeMessage />;
    }

    if (isAuthenticated && !articleFetchMade) {  
      if (!shouldRender) {
        return null;
      }
  
      return <WelcomeMessageAuthed />;
    }

    if (loading) {
      return <LoadingSpinner />;
    }

    if (tabValue > 0) {
      return (
        <TabPanel value={tabValue} index={tabValue}>
          <Typography variant="h6" sx={{ color: 'grey',  }}>
            More
          </Typography>
          <Typography variant="p" sx={{ color: 'grey', textAlign: 'left' }}>
            {clickedArticleIds.length < 6 ? 'Not unlocked yet' : 'More content'}
          </Typography>
        </TabPanel>
      )
    }

    if (articleFetchMade && articles.length > 0) {
      return (
        <TabPanel value={tabValue} index={0}>
          <ArticleList
            articles={articles}
            clickedArticleIds={clickedArticleIds}
            onArticleClick={handleArticleClick}
            onArticleSwap={handleArticleSwap}
            setArticles={setArticles}
          />
        </TabPanel>
      );
    }

    if (articleFetchMade && articles.length === 0) {
      return (
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" sx={{ color: 'grey', textAlign: 'left', mt: 2 }}>
            {'No articles found for your selected city and state.'}
          </Typography>
        </TabPanel>
      );
    }

    return null;
  };

  const handleDrawerClose = async () => {
    const currentTime = Date.now();
    const runTimeMilliseconds = currentTime - timerStartingTime;
    const runTimeSeconds = runTimeMilliseconds / 1000;
    const formattedDate = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

    if (user && user.id) {
      const fetchedPersistedClickedArticles = await fetchUserArticlesByDate(user.id, formattedDate);
      setPersistedClickedArticles(fetchedPersistedClickedArticles);
      setTimeout(() => {
        setProgressWidth(fetchedPersistedClickedArticles.articles.length === 0  ? 11 : (fetchedPersistedClickedArticles.articles.length / 6)*100);
      }, 500)
    } else {
      setTimeout(() => {
        setProgressWidth(clickedArticleIds.length === 0  ? 11 : (clickedArticleIds.length / 6)*100);
      }, 500)
    }

    // console.log(`Article ID: ${clickedArticleId}, Timer ran for: ${runTimeSeconds.toFixed(2)} seconds`);
    setDrawerOpen(false);
    setOpensInIframe(false);
    setTimerStartingTime(null);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: 560,
        margin: '0 auto 0 auto',
        padding: '0px',
        paddingBottom: '24px'
      }}
    >
      <Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="article tabs"
          sx={{
            marginLeft: '16px',
            padding: '0px',
            '& .MuiTab-root': { 
              textTransform: 'none'
            }
          }}
        >
          <Tab
            label="Daily Reading"
            sx={{
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#fff',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${progressWidth}% !important`,
                height: '100%',
                backgroundColor: persistedClickedArticles.articles.length > 5 ? 'rgba(46, 125, 50, 0.2) !important' : 'rgba(25, 118, 210, 0.2) !important',
                transition: 'width 0.3s ease'
              }
            }}
          />
          <Tab label="More" />
        </Tabs>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        {renderContent()}
      </Box>
      <PopupDialog
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={popupContent.title}
        message={popupContent.message}
      />
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          zIndex: 1300,
          '& .MuiPaper-root': {
            borderRadius: '16px 16px 0 0',
            overflow: 'hidden'
          },
        }}
      >
       <IFrame
        articleUrl={articleUrl}
        setDrawerOpen={setDrawerOpen}
        articleOpensInIframe={articleOpensInIframe}
      />
      </Drawer>
    </Container>
  );
}

export default ExploreSection;
