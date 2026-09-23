#include <stdio.h>

int main(void) {
    const int minutes[] = {10, 12, 20};
    int total = 0;
    for (unsigned long i = 0; i < sizeof minutes / sizeof minutes[0]; ++i) total += minutes[i];
    printf("study total: %d\n", total);
    return 0;
}
