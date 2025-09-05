const zod = require("zod");

const generate = zod.object({
  assignments: zod
    .array(
      zod.object({
        courseId: zod.number().int().positive({
          message: "شناسه درس باید یک عدد صحیح مثبت باشد",
        }),
        professors: zod
          .array(
            zod.number().int().positive({
              message: "شناسه استاد باید عدد صحیح مثبت باشد",
            })
          )
          .min(1, { message: "حداقل یک استاد باید انتخاب شود" }),
      })
    )
    .min(1, { message: "حداقل یک درس باید انتخاب شود" }),
});

module.exports = { generate };
