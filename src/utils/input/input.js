import taiPasswordStrength from 'tai-password-strength'

export function testPasswordStrength(password) {
  const passwordTester = new taiPasswordStrength.PasswordStrength()
  let isValid = true
  const { passwordLength, charsets } = passwordTester.check(password)
  if (
    passwordLength < 6 ||
    !charsets.number ||
    !charsets.lower ||
    !charsets.upper
  )
    isValid = false
  return isValid
}
