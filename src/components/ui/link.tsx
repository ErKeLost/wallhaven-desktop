import React from 'react';

const Link = ({ href, children, replace = false, scroll = true, prefetch = true, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault();
    
    // 使用 History API 进行导航
    if (replace) {
      window.history.replaceState({}, '', href);
    } else {
      window.history.pushState({}, '', href);
    }

    // 模拟路由变化事件
    const navigationEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navigationEvent);

    // 处理滚动
    if (scroll) {
      window.scrollTo(0, 0);
    }
  };

  React.useEffect(() => {
    // 简单的预取逻辑
    if (prefetch) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    }
  }, [href, prefetch]);

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
