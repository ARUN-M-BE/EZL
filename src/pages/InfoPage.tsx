import React from 'react';

const InfoPage = ({ title, content }: { title: string, content: React.ReactNode }) => (
    <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">{title}</h1>
        <div className="prose prose-lg max-w-none text-gray-600">
            {content}
        </div>
    </div>
);

export default InfoPage;
