"use client"

import { useState, useEffect } from 'react';

interface Pagination {
  page: number;
  perPage: number;
  total: number;
}

interface EachTest {
  uuid: string;
  serviceName: string;
  createdDate: string;
}

const TestListPage: React.FC = () => {
  const [testList, setTestList] = useState<EachTest[]>([]);
  const [pages, setPages] = useState<Pagination>();

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
        setTestList(responseData.result);
        setPages(responseData.pagination);
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
      {testList?.map((item) => (
        <button
          key={item.uuid}
          type="button"
          onClick={() => window.location.href = `/test-detail/${item.uuid}`}
        >
          {item.serviceName} ({item.createdDate})
        </button>
      ))}
      <div>
        page {pages?.page} of {pages?.total}
      </div>
    </div>
  );
  
};

export default TestListPage;
