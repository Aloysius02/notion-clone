import {
  SubscriptionModalProvider
} from '@/lib/providers/subscription-modal-provider';
import {
  getActiveProductsWithPrice
} from '@/lib/supabase/queries';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

const Layout: React.FC < LayoutProps > = async ({
  children, params
}) => {
  const {
    data: products,
    error
  } = await getActiveProductsWithPrice();


  if (error) {
    console.log("error in getActiveProductsWithPrice")
    console.log(error)
    throw new Error("error in getActiveProductsWithPrice");
  }
  return (
    <main className="flex over-hidden h-screen">
      <SubscriptionModalProvider products={products}>
        {children}
      </SubscriptionModalProvider>
    </main>
  );
};

export default Layout;