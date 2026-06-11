import { Tabs } from 'expo-router';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { HapticTab } from '@/components/haptic-tab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#0D41A2',
        tabBarInactiveTintColor: '#333333',
        tabBarLabelStyle: {
          fontFamily: 'Poppins_400Regular',
          fontSize: 11,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 10,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 6,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Reporte',
          tabBarIcon: ({ color }) => <Feather name="flag" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ecopontos"
        options={{
          title: 'Ecopontos',
          tabBarIcon: ({ color }) => <Feather name="map" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="ecopontos/reciclaveis" options={{ href: null }} />
      <Tabs.Screen name="ecopontos/eletronicos" options={{ href: null }} />
      <Tabs.Screen name="ecopontos/lampadas" options={{ href: null }} />
      <Tabs.Screen name="ecopontos/medicamentos" options={{ href: null }} />
    </Tabs>
  );
}