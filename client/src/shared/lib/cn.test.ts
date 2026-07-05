import { cn } from "@/shared/lib";

describe("cn", () => {
    it("joins truthy string values", () => {
        expect(cn("a", "b")).toBe("a b");
    });

    it("ignores falsy values", () => {
        expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
    });

    it("applies object entries by their boolean condition", () => {
        expect(cn("base", { active: true, disabled: false })).toBe("base active");
    });
});
