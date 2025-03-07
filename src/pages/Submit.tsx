import React, { useState } from 'react';

export const Submit = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    githubUrl: '',
    implementationType: 'server',
    contact: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="h-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mt-6 mb-8 text-foreground">List your MCP</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
            Implementation Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2 text-foreground">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium mb-2 text-foreground">
            GitHub Repository URL
          </label>
          <input
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div>
          <label htmlFor="implementationType" className="block text-sm font-medium mb-2 text-foreground">
            Implementation Type
          </label>
          <select
            id="implementationType"
            name="implementationType"
            value={formData.implementationType}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring"
          >
            <option value="server">Server</option>
            <option value="client">Client</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium mb-2 text-foreground">
            Contact Information (optional)
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring"
            placeholder="Email or GitHub username"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
        >
          Submit Implementation
        </button>
      </form>
    </div>
  );
}; 