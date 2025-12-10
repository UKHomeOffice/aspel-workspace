import { useState } from 'react';

export const useFormSubmitHandler = () => {
  const [disabled, setDisabled] = useState(false);

  const handleFormSubmit = (e) => {
    if (disabled) {
      e.preventDefault();
    }
    e.persist();
    setTimeout(() => setDisabled(true), 0);
  };

  const handleReopen = (e) => {
    if (window.confirm('Are you sure you want to reopen this task?')) {
      return true;
    }
    e.preventDefault();
  };

  return {
    disabled,
    setDisabled,
    handleFormSubmit,
    handleReopen
  };
};

export default useFormSubmitHandler;
