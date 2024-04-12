"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import './heyyobaby.css'

interface TestDetailResponse {
  summary: Summary;
  testDetail: TestDetail[];
  terminalOutput: string;
}

interface Summary {
  counting: Counting;
  testDate: TestDate;
}

interface Counting {
  total: number;
  passed: number;
  failed: number;
}

interface TestDate {
  start: string;
  end: string;
}

interface TestDetail {
  name: string;
  passed: number;
  failed: number;
  total: number;
  routes: Route[];
}

interface Route {
  method: string;
  path: string;
  total: number;
  passed: number;
  failed: number;
  failedRefUrl: string[];
}

export default function TestDetailPage({ params }: { params: { uuid: string } }) {
  const [TestDetailResponse, setTestDetailResponse] = useState<TestDetailResponse | null>(null);
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({});

  const toggleContent = (name: string) => {
    setOpenStates((prevStates) => ({
      ...prevStates,
      [name]: !prevStates[name],
    }));
  };

  const isOpen = (name: string) => {
    return openStates[name] || false;
  };

  const openInNewTab = () => {
    const terminalOutput = TestDetailResponse?.terminalOutput; // Assuming TestDetailResponse is your object containing terminalOutput
    const bro = terminalOutput? terminalOutput : "sometext"

    const blob = new Blob([bro], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const switchMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'm-get';
      case 'POST':
        return 'm-post';
      case 'PUT':
        return 'm-put';
      case 'DELETE':
        return 'm-del';
      default:
        return 'bg-gray-200';
    }
  }

  useEffect(() => {
    const fetchTestDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/test-detail/${params.uuid}`);
        if (!response.data) {
          throw new Error('Failed to fetch test TestDetail');
        }
        setTestDetailResponse(response.data); // Assuming API response structure is { result: ApiDetail }
      } catch (error) {
        console.error('Error fetching test TestDetail:', error);
      }
    };

    fetchTestDetail();

    // Cleanup function (optional)
    return () => {
      // Perform cleanup if needed (e.g., cancel ongoing requests)
    };
  }, [params.uuid]);

  if (!TestDetailResponse) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div>
      
      <div>
        <div>TEST SUMMARY</div>
        <div>Total {TestDetailResponse.summary.counting.total}</div>
        <div>Passed {TestDetailResponse.summary.counting.total}</div>
        <div>Failed {TestDetailResponse.summary.counting.total}</div>
      </div>

      <div>
        <div>TEST DETAIL</div>
        {
          TestDetailResponse.testDetail?.map((testDetail) => (
            <div
              className="routes-detail"
              onClick={() => toggleContent(testDetail.name)}
            >
              <div className="row">
                <p className="col-1 mb-0 text-start font-weight-bold">
                  {isOpen(testDetail.name) ? '-' : '+'}
                </p>
                <div className="col text-start routes-detail-label">
                  {testDetail.name}
                </div>
                <div className="col-2 text-end">pass: {testDetail.passed}</div>
                <div className="col-2 text-end">fail: {testDetail.failed}</div>
                <div className="col-2 text-end">total: {testDetail.total}s</div>
              </div>
              <div
                className={`expandable-content ${isOpen(testDetail.name) ? '.open' : ''}`}
              >
                <table>
                  <tr>
                    <th>HTTP Method</th>
                    <th>Route</th>
                    <th>Pass Count</th>
                    <th>Fail Count</th>
                    <th>Fail Reference URL</th>
                  </tr>
                  {
                    testDetail.routes.map((route) => (
                      <tr>
                        <td className={`http-method ${switchMethodColor(route.method)}`}>
                          {route.method}
                        </td>
                        <td>/api/resource</td>
                        <td>{route.total}</td>
                        <td>{route.passed}</td>
                        <td>{route.failed}</td>
                        <td>
                          {route.failedRefUrl && route.failedRefUrl.length > 0
                            ? route.failedRefUrl.length
                            : "-"}
                        </td>
                      </tr>
                  ))}
                </table>
              </div>
            </div>
        ))}
      </div>

      <div className="log">
        <h1>Log</h1>
        <div className="row">
          <div className="col">
            <a href="#" onClick={openInNewTab}>click to see raw</a>
            <pre id="logText" className="terminal">
              {TestDetailResponse.terminalOutput}
            </pre>
          </div>
        </div>
      </div>

      
    </div>
  );
}