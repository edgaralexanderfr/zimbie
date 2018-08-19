export module util {
  /**
   * Calculates the resultant damage based on an attack and a resistance.
   *
   * **Created:** *08 13th 2018, 14:39*<br />
   * **Updated:** *08 14th 2018, 00:18*
   *
   * @param attack  Attack factor between 0.0 - 1.0
   * @param defense Defense factor between 0.0 - 1.0
   *
   * @returns Resultant damage to the object.
   *
   * @author Edgar Alexander Franco <edgaralexanderfr@gmail.com> (http://www.edgaralexanderfr.com.ve)
   */
  export function damage(attack: number, defense: number): number {
    return attack * (1.0 - defense);
  }
}
