Add-Type -AssemblyName System.Drawing
$workspace = Split-Path $PSScriptRoot -Parent
$captures = Join-Path $workspace 'previews/r15'
foreach ($variant in @('desktop', 'mobile', 'desktop-content', 'mobile-content')) {
    $before = [System.Drawing.Image]::FromFile((Join-Path $captures ('r14-' + $variant + '.png')))
    $after = [System.Drawing.Image]::FromFile((Join-Path $captures ('r15-' + $variant + '.png')))
    $column = if ($variant.StartsWith('desktop')) { 720 } else { 390 }
    $beforeHeight = [int]($before.Height * $column / $before.Width)
    $afterHeight = [int]($after.Height * $column / $after.Width)
    $sheet = New-Object System.Drawing.Bitmap ($column * 2 + 18), ([Math]::Max($beforeHeight, $afterHeight) + 48)
    $graphics = [System.Drawing.Graphics]::FromImage($sheet)
    $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#e7f0e9'))
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $font = New-Object System.Drawing.Font 'Segoe UI', 14
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#153d3a'))
    $graphics.DrawString('R14 baseline', $font, $brush, 12, 12)
    $graphics.DrawString('R15 FIRST ANSWER', $font, $brush, ($column + 30), 12)
    $graphics.DrawImage($before, 0, 48, $column, $beforeHeight)
    $graphics.DrawImage($after, ($column + 18), 48, $column, $afterHeight)
    $sheet.Save((Join-Path $captures ('r14-vs-r15-' + $variant + '.png')), [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose(); $sheet.Dispose(); $font.Dispose(); $brush.Dispose(); $before.Dispose(); $after.Dispose()
}
