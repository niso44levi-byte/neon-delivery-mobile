// app/(tabs)/index.tsx
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index(): JSX.Element {
  return <Redirect href="/screens/LoginScreen" />;
}
