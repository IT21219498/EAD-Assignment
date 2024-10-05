import AppRoutes from "./AppRoutes";
import Layout from "./components/Layout";
import { CommonContextProvider } from "./contexts/CommonContext";
import { ToastProvider } from "./contexts/ToastContext";

const App = () => {
  return (
    <ToastProvider>
      <CommonContextProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </CommonContextProvider>
    </ToastProvider>
  );
};

export default App;
