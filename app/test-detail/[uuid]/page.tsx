"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';

interface ApiDetail {
  uuid: string;
  serviceName: string;
  createdDate: string;
  // Add other properties specific to the test detail here
}

export default function TestDetailPage({ params }: { params: { uuid: string } }) {
  const [detail, setDetail] = useState<ApiDetail | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/test-detail/${params.uuid}`);
        if (!response.data) {
          throw new Error('Failed to fetch test detail');
        }
        setDetail(response.data); // Assuming API response structure is { result: ApiDetail }
      } catch (error) {
        console.error('Error fetching test detail:', error);
      }
    };

    fetchDetail();

    // Cleanup function (optional)
    return () => {
      // Perform cleanup if needed (e.g., cancel ongoing requests)
    };
  }, [params.uuid]);

  if (!detail) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div>
      <h1>Test Detail Page</h1>
      <p>UUID: {detail.uuid}</p>
      <p>Service Name: {detail.serviceName}</p>
      <p>Created Date: {detail.createdDate}</p>
      {/* Render other properties of the test detail as needed */}
    </div>
  );
}