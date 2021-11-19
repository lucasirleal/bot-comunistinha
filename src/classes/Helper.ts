export class Helper {
  public static clampString(input: string): string {
    if (input.length < 50) return input;
    return input.substring(0, 50) + '...';
  }
}
