import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import { useUser } from "@clerk/nextjs";
import InterviewListServer from "./_components/InterviewListServer";

const Dashboard = () => {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || null;

  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Dashboard</h2>
      <h2 className="text-gray-500">Create and Start your AI Mock Interview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 my-5">
        <AddNewInterview />
      </div>

      <InterviewListServer userEmail={userEmail} />
    </div>
  );
};

export default Dashboard;
