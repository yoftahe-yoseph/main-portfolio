import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPortfolioSystemInstruction,
  classifyGeminiError,
  resolveChatModel,
  sanitizeChatHistory,
  validateChatMessage,
} from './chat-utils';
import { isMapsQuotaError, MAPS_ATTRIBUTION_IDS, PORTFOLIO_HUB_QUERIES } from './maps-utils';

test('validateChatMessage rejects empty and overly long messages', () => {
  assert.equal(validateChatMessage('').ok, false);
  assert.equal(validateChatMessage('   ').ok, false);
  assert.equal(validateChatMessage(123).ok, false);
  assert.equal(validateChatMessage('a'.repeat(1600)).ok, false);

  const valid = validateChatMessage('  Tell me about MenuVista  ');
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(valid.value, 'Tell me about MenuVista');
  }
});

test('resolveChatModel enforces free-tier model allowlist', () => {
  assert.equal(resolveChatModel('balanced').model, 'gemini-4-hydrogen');
  assert.equal(resolveChatModel('fast').model, 'gemini-3.1-flash-lite');
  assert.equal(resolveChatModel('unknown-paid-model').model, 'gemini-4-hydrogen');
  assert.equal(resolveChatModel(undefined).model, 'gemini-4-hydrogen');
});

test('sanitizeChatHistory enforces user-first alternating turns and strips trailing user turn', () => {
  const sanitized = sanitizeChatHistory([
    { role: 'model', content: 'Leading model turn should be dropped' },
    { role: 'user', content: 'First question' },
    { role: 'model', content: 'First answer' },
    { role: 'user', content: 'Trailing unanswered user turn should be dropped' },
  ]);

  assert.equal(sanitized.length, 2);
  assert.equal(sanitized[0].role, 'user');
  assert.equal(sanitized[0].parts[0].text, 'First question');
  assert.equal(sanitized[1].role, 'model');
  assert.equal(sanitized[1].parts[0].text, 'First answer');
});

test('buildPortfolioSystemInstruction includes Yoftahe profile, projects, social links, and credentials', () => {
  const instruction = buildPortfolioSystemInstruction();
  assert.match(instruction, /Yoftahe Yoseph/);
  assert.match(instruction, /Leku Primary Hospital Management System/);
  assert.match(instruction, /MenuVista/);
  assert.match(instruction, /Mesob Center/);
  assert.match(instruction, /Haramaya University/);
  assert.match(instruction, /https:\/\/github\.com\/yoftahe-yoseph/);
  assert.match(instruction, /https:\/\/t\.me\/yoftu/);
  assert.match(instruction, /https:\/\/wa\.me\/251961613758/);
  assert.match(instruction, /https:\/\/www\.instagram\.com\/yoftu_/);
});

test('classifyGeminiError maps API key, quota, and model errors cleanly', () => {
  assert.equal(classifyGeminiError(new Error('429 RESOURCE_EXHAUSTED')).status, 429);
  assert.equal(classifyGeminiError(new Error('API_KEY_INVALID 403')).status, 502);
  assert.equal(classifyGeminiError(new Error('Model not found 404')).status, 503);
});

test('isMapsQuotaError detects genuine quota errors without false positives', () => {
  assert.equal(isMapsQuotaError(new Error('OverQuotaMapError: quota exceeded')), true);
  assert.equal(isMapsQuotaError({ status: 429 }), true);
  assert.equal(isMapsQuotaError({ code: 'RESOURCE_EXHAUSTED' }), true);
  assert.equal(isMapsQuotaError(new Error('Zero results returned')), false);
  assert.equal(isMapsQuotaError(null), false);
});

test('Google Maps constants enforce AI Studio attribution and hub queries', () => {
  assert.deepEqual(MAPS_ATTRIBUTION_IDS, ['gmp_mcp_codeassist_v1_aistudio']);
  assert.equal(PORTFOLIO_HUB_QUERIES.length, 4);
});
