
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-taskloop-lightgray">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-6xl font-bold text-taskloop-blue mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! We couldn't find the page you're looking for.</p>
        <p className="text-gray-600 mb-8">
          The page you are trying to access might have been removed, renamed, or is temporarily unavailable.
        </p>
        <Button asChild className="bg-taskloop-blue hover:bg-taskloop-darkblue">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
