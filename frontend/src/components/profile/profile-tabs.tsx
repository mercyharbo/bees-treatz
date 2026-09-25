'use client';

import React from 'react';
import { UserProfile } from '@/types/auth';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AccountSettingsTab } from './account-settings-tab';
import { MyOrdersTab } from './my-orders-tab';
import { SavedAddressesTab } from './saved-addresses-tab';
import { SecurityTab } from './security-tab';

interface ProfileTabsProps {
  user: UserProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onProfileUpdated?: () => Promise<unknown> | unknown;
}

export function ProfileTabs({ user, activeTab, onTabChange, onProfileUpdated }: ProfileTabsProps) {
  return (
    <Card className="lg:col-span-2 rounded-md border border-gray-200/80 dark:border-white/10 bg-white dark:bg-gray-900/60 dark:backdrop-blur-xl shadow-none overflow-hidden p-6 sm:p-8">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full flex flex-col gap-6">
        {/* Horizontal Tabs Header */}
        <TabsList
          variant="line"
          className="border-b border-gray-200 dark:border-white/10 w-full justify-start gap-4 sm:gap-8 pb-px overflow-x-auto rounded-md"
        >
          <TabsTrigger
            value="settings"
            className="text-xs sm:text-sm font-semibold pb-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 transition-colors shrink-0"
          >
            Account Settings
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="text-xs sm:text-sm font-semibold pb-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 transition-colors shrink-0"
          >
            My Orders
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="text-xs sm:text-sm font-semibold pb-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 transition-colors shrink-0"
          >
            Saved Addresses
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="text-xs sm:text-sm font-semibold pb-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white data-active:border-b-2 data-active:border-orange-500 data-active:text-orange-600 dark:data-active:text-orange-400 transition-colors shrink-0"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <AccountSettingsTab user={user} onProfileUpdated={onProfileUpdated} />
        </TabsContent>

        <TabsContent value="orders">
          <MyOrdersTab />
        </TabsContent>

        <TabsContent value="addresses">
          <SavedAddressesTab user={user} onProfileUpdated={onProfileUpdated} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab user={user} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
