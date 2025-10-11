import { Suspense } from "react";

async function fetchData() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
  return "Dynamic Data";
}

async function DataComponent() {
  const data = await fetchData();
  return <p>{data}</p>;
}

export default async function LoadingTesting() {
  // Simulate a delay at the route level
  await new Promise((resolve) => setTimeout(resolve, 3000)); // 3-second delay

  return (
    <div>
      <h1>LoadingTesting</h1>
      <p>This part loads instantly.</p>
      <Suspense fallback={<div>Loading data component...</div>}>
        <DataComponent />
      </Suspense>
    </div>
  );
}
