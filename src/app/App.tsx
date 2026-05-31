import { MainLayout } from './layout/MainLayout';
import { usePathRouting } from './routes';

export const App = () => {
  const currentComponent = usePathRouting();

  return <MainLayout>{currentComponent}</MainLayout>;
};
export default App;
