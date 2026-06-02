import { Suspense } from 'react';
import { MainLayout } from './layout/MainLayout';
import { usePathRouting } from './routes';
import { Loading } from '../components/ui/Loading';

export const App = () => {
  const currentComponent = usePathRouting();

  return (
    <MainLayout>
      <Suspense fallback={<Loading size="lg" text="Araç hazırlanıyor..." className="py-16 md:py-24" />}>
        {currentComponent}
      </Suspense>
    </MainLayout>
  );
};
export default App;
