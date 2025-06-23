// matchUtils.js
function matchRule(transaction, rule) {
    const { field, op, value } = rule;
    const fieldValue = transaction[field];
  
    switch (op) {
      case 'equals':
        return fieldValue === value;
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(value);
      case 'gt':
        return Number(fieldValue) > Number(value);
      case 'lt':
        return Number(fieldValue) < Number(value);
      default:
        return false;
    }
  }
  
  export function matchesCategory(transaction, category) {
    // Support AND/OR between rules (category.rules can have `type: 'and' | 'or'`)
    if (!category.rules?.length) return false;
    if (category.rulesType === 'or') {
      return category.rules.some((rule) => matchRule(transaction, rule));
    }
    // default to 'and'
    return category.rules.every((rule) => matchRule(transaction, rule));
  }
  