// /app/test-detail/page.tsx

import { useState, useEffect } from 'react';
import axios from 'axios';

interface ApiDetail {
  uuid: string;
  service_name: string;
  created_date: string;
  // Add other properties specific to the test detail here
}

const TestDetailPage: React.FC<{ match: { params: { uuid: string } } }> = ({ match }) => {
  const [detail, setDetail] = useState<ApiDetail | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      console.log("in fetchDetail")
      
      try {
        console.log("in fetchDetail try")
        const response = await axios.get(`http://localhost:8080/test-detail/${match.params.uuid}`);

        if (!response.data) {
          throw new Error('Failed to fetch test detail');
        }

        setDetail(response.data.result); // Assuming API response structure is { result: ApiDetail }
      } catch (error) {
        console.error('Error fetching test detail:', error);
      }
    };

    fetchDetail();

    return () => {
      // Cleanup function if needed
    };
  }, [match.params.uuid]); // Re-run effect when UUID changes

  if (!detail) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div>
      <h1>Test Detail Page</h1>
      <p>UUID: {detail.uuid}</p>
      <p>Service Name: {detail.service_name}</p>
      <p>Created Date: {detail.created_date}</p>
      {/* Render other properties of the test detail as needed */}
    </div>
  );
};

export default TestDetailPage;
