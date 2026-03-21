import React from 'react';
import './resources.css';

function Resources() {
  const resources = [
    {
      title: 'Health Resources & Services Administration (HRSA) - Office for the Advancement of Telehealth',
      description: 'Telehealth resources to help connect rural communities to doctors remotely.',
      link: 'https://www.hrsa.gov/telehealth',
    },
    {
      title: 'RHIhub - Rural Health Information Hub',
      description: 'Comprehensive source for rural health information, toolkits, and services.',
      link: 'https://www.ruralhealthinfo.org/',
    },
    {
      title: 'USDA Rural Development',
      description: 'Health and economic support programs for rural communities.',
      link: 'https://www.rd.usda.gov/',
    },
    {
      title: 'AgrAbility Project',
      description: 'Resources for farmers with disabilities and chronic conditions from injuries.',
      link: 'https://www.agrability.org/',
    },
    {
      title: 'Rural Minds',
      description: 'Promoting mental health and providing resources for rural communities.',
      link: 'https://www.ruralminds.org/',
    },
  ];

  return (
    <div className="resources-page">
      <h1 className="resources-title">
        Resources
      </h1>

      <div className="resources-list">
        {resources.map((resource) => (
          <div key={resource.title} className="resources-card">
            <h2 className="resources-card-title">
              {resource.title}
            </h2>
            <p className="resources-card-description">
              {resource.description}
            </p>
            <a
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              className="resources-link"
            >
              {resource.link}
            </a>
          </div>
        ))}
      </div>

      <div className="resources-crisis-card">
        <h2 className="resources-card-title">
          Crisis Support
        </h2>
        <p className="resources-crisis-line resources-crisis-line-first">
          <strong>Farm Crisis Hotline:</strong> 1-800-FARM-AID
        </p>
        <p className="resources-crisis-line">
          <strong>Crisis Text Line:</strong> Text HOME to 741741
        </p>
      </div>
    </div>
  );
}

export default Resources;