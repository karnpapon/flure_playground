local interpreter = require "vm"
local grid = require "grid"

local M = {}
local sz = 16

function M.init() grid.init_grid(sz) end

function M.render(code, file_name)

  local file = ""

  file = file .. ("P1\n# " .. file_name .. "\n" .. sz .. " " .. sz .. "\n")

  for y = 1, sz, 1 do
    for x = 1, sz, 1 do

      -- [EXAMPLE CODES]: try uncomment to see different results.
      -- local code = "x y ^ 5 % !"
      -- local code = "x y + abs x y - abs 1 + ^ 2 << 5 % !"
      -- local code = "x 2 * y % !"
      -- local code = "x 128 - 64 * y 128 - % !"
      -- local code = "x y ^ 7 % !"
      local opt = {}
      opt["x"] = x
      opt["y"] = y

      local val = interpreter.EXEC(code, opt)
      -- file:write(val)
      file = file .. val
      file = file .. (x == sz and "\n" or "")
    end
  end

  print(file)
end

return M
