import React from 'react';

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
    <div style={{ padding: '32px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: '#59775e', fontFamily: "'Afacad', sans-serif", marginBottom: '20px' }}>
        Resources
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {resources.map((resource) => (
          <div
            key={resource.title}
            style={{
              border: '2px solid #8f7c63',
              borderRadius: '12px',
              backgroundColor: '#f7f3ee',
              padding: '16px',
            }}
          >
            <h2 style={{ margin: 0, color: '#59775e', fontFamily: "'Afacad', sans-serif", fontSize: '1.2rem' }}>
              {resource.title}
            </h2>
            <p style={{ margin: '8px 0 10px', color: '#5a5146', fontFamily: "'Afacad', sans-serif", fontSize: '1.05rem' }}>
              {resource.description}
            </p>
            <a
              href={resource.link}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#59775e', fontFamily: "'Afacad', sans-serif", fontWeight: 600 }}
            >
              {resource.link}
            </a>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '20px',
          border: '2px solid #8f7c63',
          borderRadius: '12px',
          backgroundColor: '#fff7ef',
          padding: '16px',
        }}
      >
        <h2 style={{ margin: 0, color: '#59775e', fontFamily: "'Afacad', sans-serif", fontSize: '1.2rem' }}>
          Crisis Support
        </h2>
        <p style={{ margin: '10px 0 6px', color: '#5a5146', fontFamily: "'Afacad', sans-serif", fontSize: '1.05rem' }}>
          <strong>Farm Crisis Hotline:</strong> 1-800-FARM-AID
        </p>
        <p style={{ margin: 0, color: '#5a5146', fontFamily: "'Afacad', sans-serif", fontSize: '1.05rem' }}>
          <strong>Crisis Text Line:</strong> Text HOME to 741741
        </p>
      </div>
    </div>
  );
}

export default Resources;