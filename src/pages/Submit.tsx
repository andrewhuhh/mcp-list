import React, { useState, KeyboardEvent } from 'react';
import { supabase } from '../lib/supabase';
import { HostingType, SetupType, Status, Pricing } from '../types/mcp';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';

export const Submit = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    description: '',
    hosting_type: 'self-hosted' as HostingType,
    status: 'community' as Status,
    setup_type: 'easy-setup' as SetupType,
    pricing: 'free' as Pricing,
    categories: [] as string[],
    github_url: '',
    logo_url: '',
    features: [{ title: '', description: '' }],
    setup_guide: {
      steps: [''],
      command: '',
      url: ''
    },
    categoryInput: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Insert MCP
      const { data: mcpData, error: mcpError } = await supabase
        .from('mcps')
        .insert({
          name: formData.name,
          company: formData.company,
          description: formData.description,
          hosting_type: formData.hosting_type,
          status: formData.status,
          setup_type: formData.setup_type,
          pricing: formData.pricing,
          categories: formData.categories,
          github_url: formData.github_url,
          logo_url: formData.logo_url || null
        })
        .select()
        .single();

      if (mcpError) throw mcpError;

      // Insert features
      if (formData.features.some(f => f.title && f.description)) {
        const { error: featuresError } = await supabase
          .from('features')
          .insert(
            formData.features
              .filter(f => f.title && f.description)
              .map(feature => ({
                mcp_id: mcpData.id,
                title: feature.title,
                description: feature.description
              }))
          );

        if (featuresError) throw featuresError;
      }

      // Insert setup guide
      if (formData.setup_guide.steps.some(step => step)) {
        const { error: setupError } = await supabase
          .from('setup_guides')
          .insert({
            mcp_id: mcpData.id,
            steps: formData.setup_guide.steps.filter(step => step),
            command: formData.setup_guide.command || null,
            url: formData.setup_guide.url || null
          });

        if (setupError) throw setupError;
      }

      toast.success("Your MCP implementation has been submitted successfully.");

      // Reset form
      setFormData({
        name: '',
        company: '',
        description: '',
        hosting_type: 'self-hosted',
        status: 'community',
        setup_type: 'easy-setup',
        pricing: 'free',
        categories: [],
        github_url: '',
        logo_url: '',
        features: [{ title: '', description: '' }],
        setup_guide: {
          steps: [''],
          command: '',
          url: ''
        },
        categoryInput: ''
      });

    } catch (error) {
      console.error('Error submitting MCP:', error);
      toast.error("There was an error submitting your MCP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      categoryInput: value
    }));
  };

  const handleCategoryKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.categoryInput.trim()) {
      e.preventDefault();
      const newCategory = formData.categoryInput.trim();
      
      if (!formData.categories.includes(newCategory)) {
        setFormData(prev => ({
          ...prev,
          categories: [...prev.categories, newCategory],
          categoryInput: ''
        }));
      }
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category !== categoryToRemove)
    }));
  };

  const handleFeatureChange = (index: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { title: '', description: '' }]
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleStepChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      setup_guide: {
        ...prev.setup_guide,
        steps: prev.setup_guide.steps.map((step, i) =>
          i === index ? value : step
        )
      }
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      setup_guide: {
        ...prev.setup_guide,
        steps: prev.setup_guide.steps.filter((_, i) => i !== index)
      }
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      setup_guide: {
        ...prev.setup_guide,
        steps: [...prev.setup_guide.steps, '']
      }
    }));
  };

  return (
    <div className="h-full max-w-2xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mt-6 mb-8 text-foreground">Submit Your MCP Implementation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">
              Implementation Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
              required
              placeholder="e.g. Cursor MCP"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-2 text-foreground">
              Company/Organization*
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
              required
              placeholder="e.g. Cursor"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2 text-foreground">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
              required
              placeholder="e.g. Cursor is a code editor that allows you to write code in any language, and it has a built-in MCP server."
            />
          </div>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Configuration</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="hosting_type" className="block text-sm font-medium mb-2 text-foreground">
                Hosting Type*
              </label>
              <select
                id="hosting_type"
                name="hosting_type"
                value={formData.hosting_type}
                onChange={handleChange}
                className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
                required
              >
                <option value="self-hosted">Self Hosted</option>
                <option value="cloud-hosted">Cloud Hosted</option>
              </select>
            </div>

            <div>
              <label htmlFor="setup_type" className="block text-sm font-medium mb-2 text-foreground">
                Setup Type*
              </label>
              <select
                id="setup_type"
                name="setup_type"
                value={formData.setup_type}
                onChange={handleChange}
                className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
                required
              >
                <option value="easy-setup">Easy Setup</option>
                <option value="flexible-config">Flexible Config</option>
                <option value="for-developers">For Developers</option>
              </select>
            </div>

            <div>
              <label htmlFor="pricing" className="block text-sm font-medium mb-2 text-foreground">
                Pricing*
              </label>
              <select
                id="pricing"
                name="pricing"
                value={formData.pricing}
                onChange={handleChange}
                className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
                required
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="categories" className="block text-sm font-medium mb-2 text-foreground">
              Categories*
            </label>
            <div className="space-y-2">
              <input
                type="text"
                id="categories"
                value={formData.categoryInput || ''}
                onChange={handleCategoryChange}
                onKeyDown={handleCategoryKeyDown}
                className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
                placeholder="Type a category and press Enter"
              />
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="ml-1 hover:text-destructive focus:outline-none"
                      aria-label={`Remove ${category} category`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </Badge>
                ))}
              </div>
              {formData.categories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Add at least one category
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Links</h2>
          
          <div>
            <label htmlFor="github_url" className="block text-sm font-medium mb-2 text-foreground">
              GitHub Repository*
            </label>
            <input
              type="url"
              id="github_url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
              required
              placeholder="https://github.com/your-repo"
            />
          </div>

          <div>
            <label htmlFor="logo_url" className="block text-sm font-medium mb-2 text-foreground">
              Logo URL
            </label>
            <input
              type="url"
              id="logo_url"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleChange}
              className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Features</h2>
            <button
              type="button"
              onClick={addFeature}
              className="px-3 py-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md transition-colors tracking-tight font-semibold"
            >
              + Add Feature
            </button>
          </div>
          
          {formData.features.map((feature, index) => (
            <div key={index} className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                    placeholder="Feature title"
                    className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
                  />
                  <textarea
                    value={feature.description}
                    onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                    placeholder="Feature description"
                    rows={2}
                    className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
                  />
                </div>
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="h-10 px-3 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md transition-colors self-start"
                    aria-label="Remove feature"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 13H5v-2h14v2z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Setup Guide */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Setup Guide</h2>
            <button
              type="button"
              onClick={addStep}
              className="px-3 py-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md transition-colors tracking-tight font-semibold"
            >
              + Add Step
            </button>
          </div>
          
          {formData.setup_guide.steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-1 px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
              />
              {formData.setup_guide.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="px-3 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md transition-colors"
                  aria-label="Remove step"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 13H5v-2h14v2z"/>
                    </svg>
                </button>
              )}
            </div>
          ))}

          <div>
            <label htmlFor="setup_command" className="block text-sm font-medium mb-2 text-foreground">
              Setup Command
            </label>
            <input
              type="text"
              id="setup_command"
              name="setup_command"
              value={formData.setup_guide.command}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                setup_guide: { ...prev.setup_guide, command: e.target.value }
              }))}
              className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
              placeholder="e.g. npm install @your-mcp/client"
            />
          </div>

          <div>
            <label htmlFor="setup_url" className="block text-sm font-medium mb-2 text-foreground">
              Documentation URL
            </label>
            <input
              type="url"
              id="setup_url"
              name="setup_url"
              value={formData.setup_guide.url}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                setup_guide: { ...prev.setup_guide, url: e.target.value }
              }))}
              className="w-full px-2 py-2 rounded-md bg-background border border-border focus:ring-2 focus:ring-ring text-sm"
              placeholder="https://docs.your-mcp.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-2 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-tight font-semibold"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Implementation'}
        </button>
      </form>
    </div>
  );
};