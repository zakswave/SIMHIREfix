import React from 'react';
import { ExternalLink, Github, Star, Edit2, Trash2, Link2, Code, FolderOpen } from 'lucide-react';
import { PortfolioProject } from '@/lib/portfolio';
import { Button } from '@/components/ui/button';

interface ProjectCardProps {
  project: PortfolioProject;
  onEdit: (project: PortfolioProject) => void;
  onDelete: (project: PortfolioProject) => void;
  onToggleFeatured: (project: PortfolioProject) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete, onToggleFeatured }) => {
  const getProjectIcon = () => {
    if (project.coverImage) {
      return (
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
        {project.title.charAt(0)}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-primary-300 transition-all group">
      {}
      <div className="flex items-start gap-3 mb-4">
        {getProjectIcon()}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                {project.featured && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center gap-1 flex-shrink-0">
                    <Star size={12} className="fill-current" />
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">
                {project.tech.length} teknologi • {project.highlights.length} highlights
              </p>
            </div>
          </div>
        </div>
      </div>

      {}
      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
        {project.description || 'Belum ada deskripsi.'}
      </p>

      {}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tech.slice(0, 3).map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-md"
          >
            {tech}
          </span>
        ))}
        {project.tech.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
            +{project.tech.length - 3}
          </span>
        )}
      </div>

      {}
      <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Code className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 mb-0.5">Tech</p>
          <p className="text-xs font-semibold text-gray-900">{project.tech.length}</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <div className="flex items-center justify-center mb-1">
            <FolderOpen className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mb-0.5">Features</p>
          <p className="text-xs font-semibold text-gray-900">{project.highlights.length}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <ExternalLink className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mb-0.5">Links</p>
          <p className="text-xs font-semibold text-gray-900">
            {[project.links?.demo, project.links?.repo, project.links?.design].filter(Boolean).length}
          </p>
        </div>
      </div>

      {}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener"
              className="p-1.5 rounded-md bg-blue-100 hover:bg-blue-200 transition text-blue-600"
              title="Demo"
            >
              <ExternalLink size={14} />
            </a>
          )}
          {project.links?.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noopener"
              className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition text-gray-700"
              title="Repository"
            >
              <Github size={14} />
            </a>
          )}
          {project.links?.design && (
            <a
              href={project.links.design}
              target="_blank"
              rel="noopener"
              className="p-1.5 rounded-md bg-purple-100 hover:bg-purple-200 transition text-purple-600"
              title="Desain"
            >
              <Link2 size={14} />
            </a>
          )}
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => onEdit(project)} className="h-8 w-8 p-0" title="Edit">
            <Edit2 size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleFeatured(project)}
            className="h-8 w-8 p-0"
            title={project.featured ? 'Remove Featured' : 'Add Featured'}
          >
            <Star size={14} className={project.featured ? 'fill-yellow-400 text-yellow-500' : 'text-gray-400'} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(project)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Hapus"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
