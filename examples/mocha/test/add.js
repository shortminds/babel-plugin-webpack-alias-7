import { expect } from 'chai';
import add from '../app/js/add';

describe('alias test', () => {
    it('should add two numbers', () => {
        expect(add(5, 5)).to.equal(10);
    });
});
