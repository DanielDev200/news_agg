import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Drawer, Tabs, Tab, Button} from '@mui/material';
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
  const { user, isAuthenticated, authAttempted, userLocation, sources, getUserLocation, cityName, getAnonId } = useAppContext();
  
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: '', message: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [articleUrl, setArticleUrl] = useState('');
  const [articleOpensInIframe, setOpensInIframe] = useState(false);
  const [servedContentMessageShown, setServedContentMessageShown] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [clickedArticleId, setClickedArticleId] = useState(null);
  const [clickedArticleIds, setClickedArticleIds] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (isAuthenticated && userLocation) {
      setLoading(articleFetchMade === false);
    } else {
      setLoading(false);
    }
  }, [articleFetchMade, isAuthenticated, userLocation]);

  const handleArticleClick = async (article) => {
    const userId = user != null ? user.id : getAnonId();
    let canLoadInIframe = true;
    setClickedArticleId(article.id);

    sources.forEach((source) => {
      if (article.url.includes(source.source) && source.loads_in_iframe === 0) {
        canLoadInIframe = false;
      }
    });

    setOpensInIframe(canLoadInIframe);
    setArticleUrl(article.url);
    setDrawerOpen(true);

    await recordUserArticleClick(userId, article.id);
    setClickedArticleIds([...clickedArticleIds, article.id]);
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

  const handleArticleSwap = async (articleId) => {
    const userId = user != null ? user.id : getAnonId();

    const index = articles.findIndex(article => article.id === articleId);
    const { city, state } = userLocation && userLocation.city && userLocation.state ? userLocation: await getUserLocation(userId);
 
    const cityToUse = city ? city : cityName;

    const stateToUse = state ? state : 'CA';

    try {
      const {
        article: newArticle,
        articleMessage,
        message,
        messageType,
        error: fetchError,
      } = await fetchSwappedArticle(
        cityToUse,
        stateToUse,
        userId,
        articles[index].category,
        articles[index].id,
        articles.filter(article => article.category === articles[index].category).map(article => article.source),
        index+1
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

  console.log('userLocation: ', userLocation);

  const renderContent = () => {
    // if (!authAttempted) {
    //   console.log('    if (!authAttempted) {')
    //   return null;
    // }

    const check = userLocation && !userLocation.city && !userLocation;
    console.log('check: ', check);

    if (Object.keys(userLocation).length === 0 && userLocation.constructor === Object) {
      console.log('if (userLocation && !userLocation.city && !userLocation) {')
      return <WelcomeMessage />;
    }

    if (isAuthenticated && !articleFetchMade) {  
      console.log('if (isAuthenticated && !articleFetchMade) {  ')
      if (!shouldRender) {
        console.log('if (!shouldRender) {')
        return null;
      }
  
      return <WelcomeMessageAuthed />;
    }

    if (loading) {
      console.log('if (loading) {')
      return <LoadingSpinner />;
    }

    if (tabValue > 0) {
      console.log('if (tabValue > 0) {')
      return (
        <TabPanel value={tabValue} index={tabValue}>
          <ArticleList
            articles={articles.filter(article => article.category === 'national')}
            clickedArticleIds={clickedArticleIds}
            onArticleClick={handleArticleClick}
            onArticleSwap={handleArticleSwap}
            setArticles={setArticles}
          />
        </TabPanel>
      )
    }

    if (articleFetchMade && articles.length > 0) {
      console.log('if (articleFetchMade && articles.length > 0) {')
      return (
        <TabPanel value={tabValue} index={0}>
          <ArticleList
            articles={articles.filter(article => article.category === 'local')}
            clickedArticleIds={clickedArticleIds}
            onArticleClick={handleArticleClick}
            onArticleSwap={handleArticleSwap}
            setArticles={setArticles}
          />
        </TabPanel>
      );
    }

    if (articleFetchMade && articles.length === 0) {
      console.log('if (articleFetchMade && articles.length === 0) {')
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
    setDrawerOpen(false);
    setOpensInIframe(false);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: 560,
        margin: '68px auto 0 auto',
        padding: '0px',
        paddingBottom: '24px'
      }}
    >
      { articleFetchMade && 
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
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              },
              position: 'fixed',
              zIndex: 10
            }}
          >
            <Tab
              disableFocusRipple={true}
              disableRipple={true}
              sx={{padding: 0, minWidth: 'unset', maxWidth: 'unset'}}
              label={
                <Button
                  disableRipple={true}
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    borderRadius: '10px',
                    padding: '2px 10px',
                    color: tabValue === 0 ? '#fff' : 'primary.main',
                    backgroundColor: tabValue === 0 ? 'primary.main' : '#fff',
                    borderColor: 'primary.main',
                    marginLeft: '28px'
                  }}
                >
                  Local
                </Button>
              }
            />
            <Tab
              disableFocusRipple={true}
              disableRipple={true}
              sx={{padding: 0, minWidth: 'unset', maxWidth: 'unset'}}
              label={
                <Button
                  disableRipple={true}
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    borderRadius: '10px',
                    padding: '2px 10px',
                    color: tabValue === 1 ? '#fff' : 'primary.main',
                    backgroundColor: tabValue === 1 ? 'primary.main' : '#fff',
                    borderColor: 'primary.main',
                    marginLeft: '8px'
                  }}
                >
                  National
                </Button>
              }
            />
          </Tabs>
        </Box>
      }
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
