"use client"

import { useState, useEffect } from 'react';
import TestDetailPage from './test-detail/page';

// Define interfaces to represent the structure of the API response
interface ApiItem {
  uuid: string;
  service_name: string;
  created_date: string;
}

const TestListPage: React.FC = () => {
  const [data, setData] = useState<ApiItem[]>([]);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/test-list', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const responseData = await response.json();
        setData(responseData.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call fetchData function when component mounts

    // Cleanup function (optional)
    return () => {
      // Perform cleanup if needed (e.g., cancel ongoing requests)
    };
  }, []); // Empty dependency array ensures effect runs only once on component mount

  return (
    <div>
      <h1>Test List Page</h1>
      {data.map((item) => (
        <button
          key={item.uuid}
          type="button"
          onClick={() => window.location.href = `/test-detail/${item.uuid}`}
        >
          {item.service_name} ({item.created_date})
        </button>
      ))}
    </div>
  );
};

export default TestListPage;
