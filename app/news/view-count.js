'use client';

import {useEffect, useState} from 'react';
import {IconEye} from '@tabler/icons-react';
import {recordView} from './view-action';

export default function ViewCount({slug, initialCount}) {
  const [count, setCount] = useState(initialCount);
  useEffect(() => {
    let recorded = false;
    let active = true;
    function onVisible() {
      if (recorded || document.visibilityState !== 'visible') return;
      recorded = true;
      recordView(slug).then(value => {
        if (active && value !== null) setCount(value);
      }).catch(() => {});
    }
    const timer = setTimeout(onVisible, 0);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      active = false;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [slug]);
  if (count == null) return null;
  return <span className="story-views" title="عدد المشاهدات">
    <IconEye size={16} aria-hidden="true"/>{count.toLocaleString('ar-SA')} مشاهدة
  </span>;
}
