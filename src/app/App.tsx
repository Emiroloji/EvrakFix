import { MainLayout } from './layout/MainLayout';
import { useHashRouting } from './routes';

export const App = () => {
  const currentComponent = useHashRouting();

  return <MainLayout>{currentComponent}</MainLayout>;
};
export default App;
