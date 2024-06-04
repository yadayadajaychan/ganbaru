export const fetchClasses = async () => {
    const res = await fetch(`/api/xxx/classes`);
    return res.json();
  };