Add-Type -AssemblyName System.Drawing
$outDir = Join-Path $PSScriptRoot '../assets/images'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
function Brush($hex) { return [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($hex)) }
function Pen($hex, $width=8) { $p=[System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml($hex), $width); $p.StartCap='Round'; $p.EndCap='Round'; return $p }
$ink=Brush '#6336BF'; $orange=Brush '#F19A58'; $white=Brush '#FFFFFF'; $dark=Pen '#43217F' 8
$names=@('relaxar','criar','aprender','movimentar','socializar','organizar','cozinhar','icon')
$backgrounds=@('#EAE2F6','#FFE7D3','#DFEAE7','#E5EBCF','#F6DCE4','#E0E7F5','#FFECCF','#6336BF')
for ($i=0; $i -lt $names.Length; $i++) {
  $bitmap=[System.Drawing.Bitmap]::new(800,480)
  $g=[System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode='AntiAlias'
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml($backgrounds[$i]))
  $g.FillEllipse((Brush '#FFFFFF'), 215,55,365,365)
  $g.FillEllipse($orange, 110,105,36,36)
  $g.DrawEllipse((Pen '#B19BCF' 3), 641,327,35,35)
  $g.DrawLine((Pen '#B19BCF' 4), 660,100,660,128); $g.DrawLine((Pen '#B19BCF' 4), 646,114,674,114)
  $g.FillEllipse((Brush '#D8CBEA'), 254,367,304,22)
  switch ($names[$i]) {
    'relaxar' {
      $g.FillRectangle($ink, 302,220,157,113); $g.FillEllipse($ink,302,285,157,65)
      $g.DrawEllipse((Pen '#6336BF' 16),425,235,80,75)
      $g.FillEllipse((Brush '#43217F'),302,202,157,36)
      $g.DrawArc((Pen '#F19A58' 7),330,120,35,70,70,220); $g.DrawArc((Pen '#F19A58' 7),390,115,35,70,70,220)
      $g.DrawLine((Pen '#43217F' 7),285,352,492,352)
    }
    'criar' {
      $g.FillRectangle((Brush '#EEE7FA'),287,126,218,218)
      $g.FillEllipse($orange,314,159,65,65); $g.FillPolygon($ink,[System.Drawing.Point[]]@([System.Drawing.Point]::new(311,310),[System.Drawing.Point]::new(384,224),[System.Drawing.Point]::new(469,310)))
      $g.DrawLine((Pen '#43217F' 23),493,157,415,285); $g.DrawLine((Pen '#F19A58' 14),493,157,449,229)
    }
    'aprender' {
      $g.FillPolygon($ink,[System.Drawing.Point[]]@([System.Drawing.Point]::new(273,156),[System.Drawing.Point]::new(397,183),[System.Drawing.Point]::new(397,341),[System.Drawing.Point]::new(273,313)))
      $g.FillPolygon($orange,[System.Drawing.Point[]]@([System.Drawing.Point]::new(403,183),[System.Drawing.Point]::new(528,156),[System.Drawing.Point]::new(528,313),[System.Drawing.Point]::new(403,341)))
      foreach ($y in @(208,241,274)) { $g.DrawLine((Pen '#D7C6F3' 5),295,$y,372,($y+17)); $g.DrawLine((Pen '#FFFFFF' 5),429,($y+17),504,$y) }
    }
    'movimentar' {
      $g.FillPolygon($ink,[System.Drawing.Point[]]@([System.Drawing.Point]::new(280,251),[System.Drawing.Point]::new(315,185),[System.Drawing.Point]::new(392,229),[System.Drawing.Point]::new(451,248),[System.Drawing.Point]::new(518,290),[System.Drawing.Point]::new(529,331),[System.Drawing.Point]::new(278,331)))
      $g.FillRectangle($orange,278,327,251,22)
      $g.DrawLine((Pen '#FFFFFF' 7),385,249,407,233); $g.DrawLine((Pen '#FFFFFF' 7),416,261,438,245)
      $g.DrawLine((Pen '#F19A58' 7),266,180,235,180); $g.DrawLine((Pen '#F19A58' 7),262,210,210,210)
    }
    'socializar' {
      $g.FillEllipse($ink,268,145,186,131); $g.FillPolygon($ink,[System.Drawing.Point[]]@([System.Drawing.Point]::new(285,240),[System.Drawing.Point]::new(285,288),[System.Drawing.Point]::new(333,256)))
      $g.FillEllipse($orange,378,239,162,103); $g.FillPolygon($orange,[System.Drawing.Point[]]@([System.Drawing.Point]::new(492,324),[System.Drawing.Point]::new(528,354),[System.Drawing.Point]::new(523,306)))
      foreach ($x in @(310,354,398)) { $g.FillEllipse($white,$x,204,13,13) }
      $g.DrawLine((Pen '#FFFFFF' 6),411,282,505,282); $g.DrawLine((Pen '#FFFFFF' 6),411,301,476,301)
    }
    'organizar' {
      $g.FillRectangle($ink,280,156,238,188); $g.FillRectangle((Brush '#EEE7FA'),298,175,202,62); $g.FillRectangle((Brush '#EEE7FA'),298,251,202,74)
      $g.FillRectangle($orange,377,191,44,13); $g.FillRectangle($orange,377,270,44,13)
      $g.DrawLine($dark,296,349,296,365); $g.DrawLine($dark,502,349,502,365)
    }
    'cozinhar' {
      $g.FillEllipse((Brush '#7EA284'),317,189,69,81); $g.FillEllipse($orange,393,186,68,75); $g.FillEllipse((Brush '#D96B69'),350,200,64,67)
      $g.FillPie($ink,279,161,250,189,0,180); $g.FillRectangle($ink,359,329,89,16)
      $g.DrawLine((Pen '#F19A58' 12),478,241,517,133)
      $g.DrawArc((Pen '#FFFFFF' 5),300,178,206,126,15,145)
    }
    'icon' {
      $g.FillEllipse($orange,355,118,95,95)
      $g.FillRectangle($ink,319,185,46,136); $g.FillEllipse($ink,322,212,153,131); $g.FillEllipse($white,368,250,57,52)
    }
  }
  if ($names[$i] -eq 'icon') {
    $square = $bitmap.Clone([System.Drawing.Rectangle]::new(160,0,480,480), $bitmap.PixelFormat)
    $square.Save((Join-Path $outDir 'icon.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $square.Dispose()
  } else {
    $bitmap.Save((Join-Path $outDir ($names[$i]+'.png')), [System.Drawing.Imaging.ImageFormat]::Png)
  }
  $g.Dispose(); $bitmap.Dispose()
}
