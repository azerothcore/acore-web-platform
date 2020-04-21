/* eslint camelcase: 0 */
import { formatDistanceToNow, parseISO } from 'date-fns';
import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import useSWR from 'swr';
import fetch from 'unfetch';
import CardFeature from '../components/CardFeature';
import Layout from '../components/Layout';
import features from '../data/features';

function cutString(string) {
  if (string.length > 60) {
    return `${string.slice(0, 57)}...`;
  }
  return string;
}

const fetcher = url => fetch(url).then(r => r.json());

export default function Index() {
  const { data, error } = useSWR(
    'https://api.github.com/repos/azerothcore/azerothcore-wotlk/commits?per_page=15',
    fetcher,
  );

  return (
    <Layout>
      <div className="features-wrapper">
        <Container>
          <Row>
            {features.map(feature => (
              <Col sm="6" lg="4" key={feature.id}>
                <CardFeature
                  icon={feature.icon}
                  title={feature.title}
                  text={feature.text}
                />
              </Col>
            ))}
          </Row>
          <hr />
          <Row className="text-center">
            <Col lg="8">
              <h2>Latest GitHub commits</h2>
              <div className="commits">
                {!data && <p>Loading latest GitHub commits</p>}
                {error && <p>Error while fetching latest GitHub commits</p>}
                {data && (
                  <ul className="commits-list">
                    {data.map(commitObj => {
                      const { author, commit, html_url, sha } = commitObj;
                      return (
                        <li key={sha}>
                          <img
                            src={
                              author?.avatar_url ||
                              `${process.env.BACKEND_URL}/bot-avatar.png`
                            }
                            alt="Github avatar"
                            className="github-avatar"
                          />
                          {author ? (
                            <a href={author.html_url} className="github-user">
                              {author.login}
                            </a>
                          ) : (
                            commit.author.name
                          )}
                          <span className="item-separator">committed</span>
                          <span className="github-link-container">
                            <a
                              href={html_url}
                              title={commit.message}
                              className="github-commit-link"
                            >{`${cutString(commit.message)}`}</a>
                          </span>
                          <span className="github-time">{`${formatDistanceToNow(
                            parseISO(commit.author.date),
                          )} ago`}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <style jsx>
        {`
          .github-avatar {
            width: 25px;
            height: 25px;
            min-width 25px;
          }
          .commits-list {
            list-style: none;
            text-align: left;
            margin: 0;
          }
          .commits-list li{
            margin: 5px 0;
            white-space: nowrap;
            display: flex;
          }
          .github-avatar {
            margin-right: 5px;
          }
          .github-link-container {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;            
          }
          .github-time {
            margin-left: 5px;
          } 
          hr {
            border: 1px solid #ca0000;
          }
          .item-separator {
            margin: 0 5px;
          }
          @media (max-width: 575px) {
            .commits-list li {
              white-space: normal;
              display: -webkit-box;
            }
            .github-link-container {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: normal;            
            }
          }
        `}
      </style>
      <style jsx global>
        {`
          .features-wrapper {
            padding: 40px 0;
          }
          .features-wrapper h3 {
            margin: 0;
            font-size: 24px;
          }
        `}
      </style>
    </Layout>
  );
}
