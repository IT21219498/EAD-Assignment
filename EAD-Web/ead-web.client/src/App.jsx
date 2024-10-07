import AppRoutes from "./AppRoutes";
import Layout from "./components/Layout";
import { AuthContextProvider } from "./contexts/AuthContext";
import { CommonContextProvider } from "./contexts/CommonContext";
import { ToastProvider } from "./contexts/ToastContext";
import { NewToastProvider } from "./contexts/NewToastContext";

const App = () => {
  return (
    <NewToastProvider>
   <ToastProvider>
      <CommonContextProvider>
        <AuthContextProvider>
        <Layout>
          <AppRoutes />
        </Layout>
        </AuthContextProvider>
      </CommonContextProvider>
    </ToastProvider>
    </NewToastProvider>
 
  );
};

export default App;
