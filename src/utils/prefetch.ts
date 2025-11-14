export const prefetchNextRoute = (currentPath: string) => {
  if (currentPath === '/') {
    import('../pages/Login');
    import('../pages/Register');
  }

  if (currentPath === '/login' || currentPath === '/register') {
    import('../dashboard/components/DashboardLayout');
    import('../dashboard/pages/DashboardOverview');
  }

  if (currentPath === '/dashboard') {
    import('../dashboard/pages/JobFinder');
    import('../dashboard/pages/SimulasiKerja');
  }

  if (currentPath === '/company') {
    import('../company/pages/CompanyJobs');
    import('../company/pages/CompanyApplicants');
  }
};

export const prefetchOnHover = (routePath: string) => {
  if (routePath.includes('/dashboard')) {
    import('../dashboard/components/DashboardLayout');
  } else if (routePath.includes('/company')) {
    import('../company/components/CompanyLayout');
  } else if (routePath === '/login') {
    import('../pages/Login');
  } else if (routePath === '/register') {
    import('../pages/Register');
  }
};
