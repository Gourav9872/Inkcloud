import React from 'react';
import MainLayout from '../../components/MainLayout';
import Hero from './container/Hero';
import Articles from './container/Articles';
import CTA from './container/CTA';

export default function Home() {
  return (
    <div>
      <MainLayout>
        <Hero/>
        <Articles/>
        <CTA/>
      </MainLayout>
    </div>
  )
}
