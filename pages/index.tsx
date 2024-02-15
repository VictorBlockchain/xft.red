import dynamic from 'next/dynamic';
import Image from 'next/image';
import Layout from '../components/Layout';

// Create a Loading Component
const LoadingComponent = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Image src="/img/loading.gif" alt="Loading..." width={100} height={100} />
    </div>
  );
};

// Dynamically import the Start component with the loading component
const Start = dynamic(() => import('../components/Start'), {
  loading: LoadingComponent
});

const Home = () => {
  return (
    <Layout>
      <Start />
    </Layout>
  );
};

export default Home;
