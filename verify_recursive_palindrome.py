from math import isqrt

def digital_root(n):
    while n >= 10:
        n = sum(int(d) for d in str(n))
    return n

def is_palindrome(n):
    s = str(n)
    return len(s) == 3 and s == s[::-1]

def count_divisors(n):
    count = 0
    for i in range(1, isqrt(n) + 1):
        if n % i == 0:
            count += 1 if i * i == n else 2
    return count

def is_prime(n):
    if n < 2: return False
    for i in range(2, isqrt(n) + 1):
        if n % i == 0:
            return False
    return True

a = {1: 3}
for n in range(2, 1000):
    a[n] = (a[n-1]**2 + digital_root(n)) % 1000

for n in range(51, 1000):
    if is_prime(n): continue  # must be composite
    if not is_palindrome(a[n]): continue
    if a[n] % 19 != a[n-17] % 19: continue
    if not is_prime(count_divisors(a[n])): continue
    print(f"Valid n: {n}")
    break

