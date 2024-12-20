import { lazy } from 'react';

export const Dashboard = lazy(() => import('./Dashboard'));
export const Chat = lazy(() => import('./Chat'));
export const SettingsPage = lazy(() => import('./Settings'));
export const GamificationSystem = lazy(() => import('./gamification/GamificationSystem'));
export const SignIn = lazy(() => import('./auth/SignIn'));
export const SignUp = lazy(() => import('./auth/SignUp'));
export const AuthCallback = lazy(() => import('./auth/AuthCallback'));
export const FitbitCallback = lazy(() => import('./auth/FitbitCallback'));
export const GoogleFitCallback = lazy(() => import('./auth/GoogleFitCallback'));
