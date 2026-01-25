import { describe, it, expect, vi } from 'vitest';
import { getFeedData } from './feeds';
import fs from 'fs';

// Mock fs module
vi.mock('fs');

describe('getFeedData', () => {
    it('should calculate reading time correctly when not provided', async () => {
        // Mock file content without readingTime
        const mockContent = `---
title: "Test Post"
description: "Description"
date: "2026-01-25"
category: "Dev"
---

${'가'.repeat(1000)}
`;

        vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);
        vi.spyOn(fs, 'existsSync').mockReturnValue(true);

        const data = await getFeedData('test-slug');

        expect(data).not.toBeNull();
        // 1000 chars / 500 chars per min = 2 mins
        expect(data?.readingTime).toBeGreaterThanOrEqual(2);
        expect(data?.readingTime).toBeLessThanOrEqual(3);
    });

    it('should use provided reading time if exists', async () => {
        const mockContent = `---
title: "Test Post"
description: "Description"
date: "2026-01-25"
category: "Dev"
readingTime: 10
---

Short content
`;

        vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);
        vi.spyOn(fs, 'existsSync').mockReturnValue(true);

        const data = await getFeedData('test-slug');

        expect(data?.readingTime).toBe(10);
    });

    it('should validate required fields', async () => {
        const mockContent = `---
description: "Missing Title"
date: "2026-01-25"
category: "Dev"
---
Content
`;
        vi.spyOn(fs, 'readFileSync').mockReturnValue(mockContent);
        // Zod validation should fail, returning null (and logging error)
        const data = await getFeedData('invalid-slug');
        expect(data).toBeNull();
    });
});
