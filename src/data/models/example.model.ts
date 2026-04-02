/**
 * Data Models
 * Models for API responses and local data structures
 * These are DTO (Data Transfer Objects)
 */

export interface ExampleModel {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const mapExampleModelToEntity = (model: ExampleModel) => {
  return {
    id: model.id,
    name: model.name,
    email: model.email,
    createdAt: new Date(model.createdAt),
  };
};
