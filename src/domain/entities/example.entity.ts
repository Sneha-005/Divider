/**
 * Example Entity
 * These are pure business logic models (no framework dependencies)
 */

export class ExampleEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly createdAt: Date
  ) {}
}
