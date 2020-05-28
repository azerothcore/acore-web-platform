import * as React from 'react';
import {
  Button,
  Card,
  CardTitle,
  Col,
  Container,
  Row,
  TabContent,
  TabPane,
  Spinner,
} from 'reactstrap';
import { useSWRPages } from 'swr';
import { useInView } from 'react-intersection-observer';
import ReactMarkdown from 'react-markdown';
import Layout from '@/components/Layout';
import TabsNavigation from '@/components/TabsNavigation';
import { useCatalogueList } from '@/utils/catalogue-hooks';
import { getPreviewText } from '@/utils/functions';

const tabs = [
  { id: 'all', label: 'All Modules' },
  { id: 'premium', label: 'Premium Modules' },
  { id: 'tools', label: 'Tools' },
  { id: 'lua-scripts', label: 'Lua scripts' },
];

const Catalogue: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('all');
  const [errorOnFetch, setErrorOnFetch] = React.useState(false);
  const [ref, inView] = useInView({
    rootMargin: '-50px 0px',
  });
  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    // page key
    'catalogue-list',

    // page component
    ({ offset, withSWR }) => {
      const { data, error } = withSWR(
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCatalogueList(offset)
      );
      console.log(data);
      if (error) {
        setErrorOnFetch(true);
      }
      return (
        <TabContent activeTab={activeTab}>
          <TabPane tabId={activeTab}>
            <Row>
              {data &&
                data.catalogueItems !== null &&
                data.catalogueItems.nodes.map(item => {
                  return (
                    <Col lg="6" md="6" xl="6" key={item.databaseId}>
                      <div className="testimonials-card-container">
                        <Card className="post-card" body>
                          <div className="testimonial-image-container">
                            {item.featuredImage && (
                              <img
                                src={item.featuredImage.sourceUrl}
                                alt={item.featuredImage.altText}
                              />
                            )}
                          </div>
                          <hr />
                          <CardTitle className="post-card-title">
                            <h3>{item.title}</h3>
                          </CardTitle>
                          <div className="card-text">
                            <div className="card-preview-text">
                              <ReactMarkdown
                                source={
                                  item.content
                                    ? getPreviewText(item.content, 100)
                                    : ''
                                }
                                escapeHtml={false}
                              />
                            </div>
                          </div>
                          <div className="button-container">
                            {/* <LinkPrefetch
                              href="/[...dynamic]"
                              as={`${process.env.BACKEND_URL}/catalogue/${item.slug}`}
                              passHref
                              prefetch={false}
                              className="testimonials-link"
                              prepare={() =>
                                getCurrentCatalogueItem(testimonial.slug)
                              }
                            >
                              <Button className="post-card-button">
                                Read more
                              </Button>
                            </LinkPrefetch> */}
                          </div>
                        </Card>
                      </div>
                    </Col>
                  );
                })}
            </Row>
          </TabPane>
          <style jsx>
            {`
              p {
                text-align: center;
              }
              .testimonials-card-container {
                padding: 10px;
              }
              .card-text {
                margin-bottom: 10px;
                min-height: 72px;
              }
              h3 {
                font-size: 1.35rem;
                margin-bottom: 0.3rem;
              }
              hr {
                margin-top: 20px;
                margin-bottom: 0.7rem;
              }
              .button-container {
                display: flex;
                justify-content: stretch;
              }
              .testimonial-image-container {
                height: 170px;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              img {
                width: auto;
                max-height: 100%;
                max-width: 100%;
              }
            `}
          </style>
          <style jsx global>
            {`
              .post-card-title {
                margin-bottom: 0;
              }
              .post-card-button {
                width: 100%;
              }
              .card-preview-text p {
                margin: 0;
              }
              .card-preview-text p::first-letter {
                text-transform: uppercase;
              }
              .card-preview-text ol,
              .card-preview-text li {
                list-style: none;
              }
              .testimonials-link {
                width: 100%;
                height: 100%;
              }
            `}
          </style>
        </TabContent>
      );
    },

    // get next page's offset from the page endCursor
    SWR => {
      // there's no next page
      if (SWR.data && !SWR.data.catalogueItems.pageInfo.hasNextPage)
        return null;

      // offset = page endCursor
      return SWR.data.catalogueItems.pageInfo.endCursor;
    },

    // deps of the page component
    [activeTab]
  );

  const toggle = newTab => {
    if (activeTab !== newTab) setActiveTab(newTab);
  };

  return (
    <Layout
      page="catalogue"
      title="Catalogue"
      lead="Enhance your AzerothCore experience"
    >
      <div className="catalogue-container">
        <Container>
          <Row>
            <Col xl="12">
              <div>Search an item by name:</div>
            </Col>
            <Col xs="12" md="6">
              <div>Input search</div>
            </Col>
            <Col xs="12" md="6">
              <div>How to add new items</div>
            </Col>
          </Row>
          <Row>
            <Col>
              <TabsNavigation
                tabs={tabs}
                activeTab={activeTab}
                toggle={toggle}
              />
            </Col>
          </Row>
          {pages}
          <Row>
            <Col>
              <div className="load-more" ref={ref}>
                {!isReachingEnd && !isLoadingMore && (
                  <Button onClick={loadMore}>Load more</Button>
                )}
                {isLoadingMore && !errorOnFetch && (
                  <Spinner
                    style={{ width: '3rem', height: '3rem' }}
                    type="grow"
                  />
                )}
                {errorOnFetch && (
                  <p>There was an error fetching the catalogue</p>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <style jsx>
        {`
          .load-more {
            display: flex;
            justify-content: center;
          }
          p {
            text-align: center;
          }
        `}
      </style>
    </Layout>
  );
};

export default Catalogue;
