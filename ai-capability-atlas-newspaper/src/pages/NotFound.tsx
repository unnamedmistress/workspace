import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, Plus, ArrowLeft, FileQuestion } from "lucide-react";
import Button from "@/components/shared/Button";
import PageWrapper from "@/components/layout/PageWrapper";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="text-center space-y-4 max-w-sm">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
            <FileQuestion size={40} className="text-muted-foreground" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
            <p className="text-sm text-muted-foreground">
              The page you're looking for doesn't exist or may have been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-4">
            <Button
              onClick={() => navigate("/")}
              variant="primary"
              size="md"
              className="w-full"
              icon={<Home size={16} />}
            >
              Go to Home
            </Button>
            
            <Button
              onClick={() => navigate("/new")}
              variant="outline"
              size="md"
              className="w-full"
              icon={<Plus size={16} />}
            >
              Start New Job
            </Button>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
              <ArrowLeft size={14} />
              Go back
            </button>
          </div>

          {/* Help text */}
          <p className="text-xs text-muted-foreground pt-4">
            If you think this is an error, try refreshing the page or{" "}
            <a href="/" className="text-primary hover:underline">
              returning home
            </a>
            .
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
