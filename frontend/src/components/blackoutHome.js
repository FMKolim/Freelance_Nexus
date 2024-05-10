import React from 'react';
import './blackout.css';
//Page for mental wellbeing resources, has links and short desc of each illness

function Home() {
  const supportCategories = [
    {
      Disorder: 'Anxiety',
      Desc: 'A natural response for many when faced with stressful situations, characterized by feelings of apprehension, worry and nervousness.',
      MoreInfo: 'https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/overview/',
      Assistance: 'https://www.anxietyuk.org.uk/get-help/helpline-services/',
    },

    {
      Disorder: 'Bipolar Disorder',
      Desc: 'Mental health condition characterized by extreme mood swings, episodes of depression and mania.',
      MoreInfo: 'https://www.nhs.uk/mental-health/conditions/bipolar-disorder/',
      Assistance: 'https://www.bipolaruk.org/',
    },

    {
      Disorder: 'Depression',
      Desc: 'Mental health disorder marked by persistent feelings of sorrow, helplessness and loss of interest in activities.',
      MoreInfo: 'https://www.nhs.uk/mental-health/conditions/depression-in-adults/overview/',
      Assistance: 'https://www.nhs.uk/mental-health/conditions/depression-in-adults/support-groups/',
    },

    {
      Disorder: 'Eating Disorder',
      Desc: 'Mental health condition characterized by abnormal eating habits, behaviour towards food and own abnormal attitude towards ones weight and body image.',
      MoreInfo: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/eating-disorders/overview/',
      Assistance: 'https://www.beateatingdisorders.org.uk/',
    },

    {
      Disorder: 'Paranoia',
      Desc: 'Mental health condition characterized by irrational beliefs and fears of being attacked and persecuted if they fall behind/dont meet standards.',
      MoreInfo: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/paranoia/what-is-paranoia/',
      Assistance: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/paranoia/supporting-someone-with-paranoia/#:~:text=There%20are%20lots%20of%20ways,with%20paranoia%20is%20incredibly%20draining%E2%80%A6',
    },

    {
      Disorder: 'Psychosis',
      Desc: 'Individual loses contact with reality and starts hallucinating, one cause may be excessive stress and lack of sleep.',
      MoreInfo: 'https://www.nhs.uk/mental-health/conditions/psychosis/',
      Assistance: 'https://www.nhs.uk/mental-health/conditions/psychosis/treatment/',
    },

    {
      Disorder: 'Schizophrenia',
      Desc: 'Chronic mental disorder characterized by disturbances in perception of reality, thoughts, emotions and behaviour.',
      MoreInfo: 'https://www.nhs.uk/mental-health/conditions/schizophrenia/overview/',
      Assistance: 'https://www.nhs.uk/mental-health/conditions/schizophrenia/treatment/',
    },
    
  ];

  return (

    <div className='support-boxes'>

      {supportCategories.map((category, index) => (

        <div className='support-box' key={index}>

          <h2>{category.Disorder}</h2>

          <p>{category.Desc}</p>

          <div className='links'>

            <a href={category.MoreInfo} target='_blank' rel='noopener noreferrer'>More Information </a>

            <br />

            <a href={category.Assistance} target='_blank' rel='noopener noreferrer'>Get Assistance</a>

          </div>

        </div>

      ))}

    </div>

  );

}

export default Home;
