'use client';

import Header from '@/components/Header';
import ProjectForm from '@/components/ProjectForm';

export default function CreatePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ProjectForm />
      </main>
    </>
  );
}
